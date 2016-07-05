package br.com.fico.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.fico.models.Launch;
import br.com.fico.models.LaunchType;

@Repository
public interface LaunchRepository extends CrudRepository<Launch, Long> {

	List<Launch> findByType(LaunchType type);
	
}
